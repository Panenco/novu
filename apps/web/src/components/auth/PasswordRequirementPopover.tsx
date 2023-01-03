import { useState, useMemo } from 'react';
import { Text, Box, createStyles, Popover } from '@mantine/core';
import { useWatch } from 'react-hook-form';
import { Check } from '../../design-system/icons';
import { Close } from '../../design-system/icons/actions/Close';
import { colors } from '../../design-system';
import { PasswordStrengthBar } from './PasswordStrengthBar';

const usePopoverStyles = createStyles(({ colorScheme }) => ({
  dropdown: {
    padding: '12px 20px 14px 15px',
    backgroundColor: colorScheme === 'dark' ? colors.B20 : colors.white,
    position: 'absolute',
    color: colorScheme === 'dark' ? colors.white : colors.B40,
    border: 'none',
    marginTop: '1px',
  },
  arrow: {
    backgroundColor: colorScheme === 'dark' ? colors.B20 : colors.white,
    height: '7px',
    border: 'none',
    margin: '0px',
  },
}));

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text color={meets ? 'teal' : 'red'} sx={{ display: 'flex', alignItems: 'center' }} mt={7} size="sm">
      {meets ? <Check /> : <Close />} <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /^.{8,64}$/, label: 'Minimum 8 characters, Maximum 64 characters' },
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[#?!@$%^&*()-]/, label: 'Includes special symbol #?!@$%^&*()-' },
];

export function PasswordRequirementPopover({ control, children }) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const password = useWatch({
    control,
    name: 'password',
  });

  const { classes } = usePopoverStyles();
  const checks = useMemo(
    () =>
      requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
      )),
    [password]
  );

  return (
    <div>
      <Popover opened={popoverOpened} position="bottom" width="target" transition="pop" classNames={classes}>
        <Popover.Target>
          <div onFocusCapture={() => setPopoverOpened(true)} onBlurCapture={() => setPopoverOpened(false)}>
            {children}
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <PasswordStrengthBar password={password} />
          {checks}
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}
