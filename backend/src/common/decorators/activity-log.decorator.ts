import { SetMetadata } from "@nestjs/common";

export const LOG_ACTIVITY_KEY = "LOG_ACTIVITY_ACTION";

export const LogActivity = (action: string) => SetMetadata(LOG_ACTIVITY_KEY, action);
