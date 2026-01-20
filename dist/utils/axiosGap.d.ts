import { AxiosInstance, isAxiosError } from 'axios';
export interface CreateAxiosGapOptions {
    gapToken?: string;
}
/**
 * Create an axios instance configured to route through GAP proxy
 */
export declare function create(options?: CreateAxiosGapOptions): AxiosInstance;
export { isAxiosError };
declare const _default: {
    create: typeof create;
    isAxiosError: typeof isAxiosError;
};
export default _default;
//# sourceMappingURL=axiosGap.d.ts.map