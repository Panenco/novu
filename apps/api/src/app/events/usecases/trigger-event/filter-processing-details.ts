import { StepFilter } from '@novu/dal';
import { IFilterVariables } from './types';

interface ICondition {
  filter: string;
  field: string;
  expected: string;
  actual: string;
  operator: string;
  passed: boolean;
}

export class FilterProcessingDetails {
  private conditions: ICondition[] = [];
  private filter: StepFilter;
  private variables: IFilterVariables;

  addFilter(filter: StepFilter, variables: IFilterVariables) {
    this.filter = filter;
    this.variables = variables;
    this.conditions = [];
  }

  addCondition(condition: ICondition) {
    this.conditions.push(condition);
  }

  toString() {
    return JSON.stringify({
      payload: this.variables,
      filter: this.filter,
      conditions: this.conditions,
    });
  }
}
