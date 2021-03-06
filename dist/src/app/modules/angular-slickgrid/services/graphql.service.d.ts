import { Pagination } from './../models/pagination.interface';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, FilterChangedArgs, GraphqlCursorPaginationOption, GraphqlDatasetFilter, GraphqlPaginationOption, GraphqlServiceOption, GraphqlSortingOption, PaginationChangedArgs, SortChangedArgs } from './../models';
export declare class GraphqlService implements BackendService {
    private translate;
    options: GraphqlServiceOption;
    pagination: Pagination | undefined;
    defaultOrderBy: GraphqlSortingOption;
    defaultPaginationOptions: GraphqlPaginationOption | GraphqlCursorPaginationOption;
    constructor(translate: TranslateService);
    /**
     * Build the GraphQL query, since the service include/exclude cursor, the output query will be different.
     * @param serviceOptions GraphqlServiceOption
     */
    buildQuery(): string;
    /**
     * From an input array of strings, we want to build a GraphQL query string.
     * The process has to take the dot notation and parse it into a valid GraphQL query
     * Following this SO answer https://stackoverflow.com/a/47705476/1212166
     *
     * INPUT
     *  ['firstName', 'lastName', 'billing.address.street', 'billing.address.zip']
     * OUTPUT
     * firstName, lastName, billing{address{street, zip}}
     * @param inputArray
     */
    buildFilterQuery(inputArray: string[]): string;
    initOptions(serviceOptions?: GraphqlServiceOption, pagination?: Pagination): void;
    /**
     * Get an initialization of Pagination options
     * @return Pagination Options
     */
    getInitPaginationOptions(): GraphqlDatasetFilter;
    getDatasetName(): string;
    resetPaginationOptions(): void;
    updateOptions(serviceOptions?: GraphqlServiceOption): void;
    onFilterChanged(event: Event, args: FilterChangedArgs): Promise<string>;
    onPaginationChanged(event: Event, args: PaginationChangedArgs): string;
    onSortChanged(event: Event, args: SortChangedArgs): string;
    /**
     * A function which takes an input string and removes double quotes only
     * on certain fields are identified as GraphQL enums (except fields with dot notation)
     * For example let say we identified ("direction:", "sort") as word which are GraphQL enum fields
     * then the result will be:
     * FROM
     * query { users (orderBy:[{field:"firstName", direction:"ASC"} }]) }
     * TO
     * query { users (orderBy:[{field: firstName, direction: ASC}})}
     *
     * EXCEPTIONS (fields with dot notation "." which are inside a "field:")
     * these fields will keep double quotes while everything else will be stripped of double quotes
     * query { users (orderBy:[{field:"billing.street.name", direction: "ASC"} }
     * TO
     * query { users (orderBy:[{field:"billing.street.name", direction: ASC}}
     * @param inputStr input string
     * @param enumSearchWords array of enum words to filter
     * @returns outputStr output string
     */
    trimDoubleQuotesOnEnumField(inputStr: string, enumSearchWords: string[], keepArgumentFieldDoubleQuotes: boolean): string;
}
