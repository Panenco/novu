import { IPartnerConfiguration, OrganizationEntity } from './organization.entity';
import { BaseRepository } from '../base-repository';
import { Organization } from './organization.schema';
import { MemberRepository } from '../member';

export class OrganizationRepository extends BaseRepository<OrganizationEntity> {
  private memberRepository = new MemberRepository();

  constructor() {
    super(Organization, OrganizationEntity);
  }

  async findUserActiveOrganizations(userId: string): Promise<OrganizationEntity[]> {
    const members = await this.memberRepository.findUserActiveMembers(userId);

    return await this.find({
      _id: members.map((member) => member._organizationId),
    });
  }

  async updateBrandingDetails(organizationId: string, branding: { color: string; logo: string }) {
    return this.update(
      {
        _id: organizationId,
      },
      {
        $set: {
          branding,
        },
      }
    );
  }

  async findPartnerConfigurationDetails(userId: string, configurationId: string) {
    const members = await this.memberRepository.findUserActiveMembers(userId);

    return await this.findOne(
      {
        _id: members.map((member) => member._organizationId),
        'partnerConfigurations.configurationId': configurationId,
      },
      { 'partnerConfigurations.$': 1 }
    );
  }

  async updatePartnerConfiguration(userId: string, configuration: IPartnerConfiguration) {
    const members = await this.memberRepository.findUserActiveMembers(userId);

    return this.update(
      {
        _id: members.map((member) => member._organizationId),
      },
      {
        $push: {
          partnerConfigurations: configuration,
        },
      }
    );
  }
}
