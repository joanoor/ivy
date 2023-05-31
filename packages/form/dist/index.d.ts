import { Rules, RuleItem, InternalRuleItem, Value, Values, ValidateOption, SyncValidateResult } from 'async-validator';
export * from 'async-validator';

interface RuleItemExtend extends RuleItem {
    trigger: string;
}
type RuleItemExtend2 = RuleItemExtend | RuleItemExtend[];
interface BaseStruct<T = string, R = boolean> {
    label: T;
    default: T | number;
    required: R;
    rule: RuleItemExtend2;
    id: T;
}
type BaseStructs = BaseStruct[];
declare function generateFormAndRules(formopts: string[], baseFormAndRuleList: BaseStructs, uniqIds?: string[]): [Record<string, any>, Rules];

interface ValidatorInterface {
    (rule: InternalRuleItem, value: Value, callback: (error?: string | Error) => void, source: Values, options: ValidateOption): SyncValidateResult | void;
}
declare class FormChecker {
    scoreChecker(): ValidatorInterface;
    phoneChecker(): ValidatorInterface;
    easyPasswordChecker(): ValidatorInterface;
    emailChecker(): ValidatorInterface;
}
declare const formChecker: FormChecker;

export { BaseStruct, BaseStructs, RuleItemExtend2, formChecker, generateFormAndRules };
