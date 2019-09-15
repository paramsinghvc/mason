import { processValue } from "./shared";
import { ComparisonOperators, CompoundOperators, BooleanConfig, OperationType } from "./types";

const atomicBooleanProcessor = (operator: ComparisonOperators, leftOperand: any, rightOperand: any): boolean => {
  switch (operator) {
    case ComparisonOperators.EQ:
      return leftOperand === rightOperand;
    case ComparisonOperators.NOT_EQ:
      return leftOperand !== rightOperand;
    case ComparisonOperators.LT:
      return leftOperand < rightOperand;
    case ComparisonOperators.LTE:
      return leftOperand <= rightOperand;
    case ComparisonOperators.GT:
      return leftOperand > rightOperand;
    case ComparisonOperators.GTE:
      return leftOperand >= rightOperand;
  }
};

const compoundBooleanProcessor = (operator: CompoundOperators, leftOperand: any, rightOperand: any): boolean => {
  switch (operator) {
    case CompoundOperators.AND:
      return leftOperand && rightOperand;
    case CompoundOperators.OR:
      return leftOperand || rightOperand;
  }
};

const booleanConfigProcessor = (booleanConfig: BooleanConfig, rootState, selfValue?: any): boolean => {
  const { type: operationType } = booleanConfig;
  switch (operationType) {
    case OperationType.ATOMIC: {
      const leftOperand = processValue(booleanConfig.leftOperand as string, rootState, selfValue);
      const rightOperand = processValue(booleanConfig.rightOperand as string, rootState, selfValue);
      return atomicBooleanProcessor(booleanConfig.operator as ComparisonOperators, leftOperand, rightOperand);
    }
    case OperationType.COMPOUND: {
      const leftOperand = booleanConfigProcessor(booleanConfig.leftOperand as BooleanConfig, rootState);
      const rightOperand = booleanConfigProcessor(booleanConfig.rightOperand as BooleanConfig, rootState);
      return compoundBooleanProcessor(booleanConfig.operator as CompoundOperators, leftOperand, rightOperand);
    }
  }
};

export const booleanProcessor = (booleanClause: boolean | BooleanConfig, rootState, selfValue?: any) => {
  if (typeof booleanClause === "boolean") {
    return booleanClause;
  }
  return booleanConfigProcessor(booleanClause as BooleanConfig, rootState, selfValue);
};
