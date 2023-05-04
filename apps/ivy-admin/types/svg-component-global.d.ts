
import '@vue/runtime-core'
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    SvgIcon: import("vue").DefineComponent<{
        name: {
            type: import("vue").PropType<"app-avatar" | "app-default-logo" | "application" | "auth-platform" | "avatar" | "exclamation" | "field" | "log" | "more" | "organization" | "overview" | "personal" | "question" | "role" | "table" | "tips-info" | "upload-avatar">;
            default: string;
            required: true;
        };
    }, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
        name: {
            type: import("vue").PropType<"app-avatar" | "app-default-logo" | "application" | "auth-platform" | "avatar" | "exclamation" | "field" | "log" | "more" | "organization" | "overview" | "personal" | "question" | "role" | "table" | "tips-info" | "upload-avatar">;
            default: string;
            required: true;
        };
    }>>, {
        name: "app-avatar" | "app-default-logo" | "application" | "auth-platform" | "avatar" | "exclamation" | "field" | "log" | "more" | "organization" | "overview" | "personal" | "question" | "role" | "table" | "tips-info" | "upload-avatar";
    }>;
  }
}
