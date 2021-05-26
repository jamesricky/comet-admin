import {
    Field,
    FilterBar,
    FilterBarMoreFilters,
    FilterBarPopoverFilter,
    FinalFormInput,
    Table,
    TableFilterFinalForm,
    TableQuery,
    useTableQuery,
    useTableQueryFilter,
} from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import gql from "graphql-tag";
import * as qs from "qs";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

const gqlRest = gql;

const query = gqlRest`
query users(
    $pathFunction: any
    $username: String
    $name: String
    $email: String
    $website: String
) {
    users(
        email: $email
        username: $username
        name: $name
        website: $website
    ) @rest(type: "User", pathBuilder: $pathFunction) {
        id
        name
        username
        email
        phone
        website
    }
}
`;
function pathFunction({ args }: { args: { [key: string]: any } }) {
    interface IPathMapping {
        [arg: string]: string;
    }
    const paramMapping: IPathMapping = {
        email: "email",
        username: "username",
        name: "name",
        website: "website",
    };

    const q = Object.keys(args).reduce((acc: { [key: string]: any }, key: string): { [key: string]: any } => {
        if (paramMapping[key] && args[key]) {
            acc[paramMapping[key]] = args[key];
        }
        return acc;
    }, {});

    return `users?${qs.stringify(q, { arrayFormat: "brackets" })}`;
}

interface IQueryData {
    users: Array<{
        id: number;
        name: string;
        username: string;
        email: string;
        phone: string;
        website: string;
    }>;
}

interface IFilterValues {
    username: any;
    name: any;
    email: any;
    website: any;
}

interface IVariables extends IFilterValues {
    pathFunction: any;
}

const ExampleWithSelect: React.FC = () => {
    const options = [
        { value: "Sincere@april.biz", label: "Sincere@april.biz" },
        { value: "Shanna@melissa.tv", label: "Shanna@melissa.tv" },
        { value: "Nathan@yesenia.net", label: "Nathan@yesenia.net" },
    ];
    return <Field name="email" type="text" component={FinalFormReactSelectStaticOptions} fullWidth options={options} />;
};

function Story() {
    const filterApi = useTableQueryFilter<Partial<IFilterValues>>({});

    const { tableData, api, loading, error } = useTableQuery<IQueryData, Partial<IVariables>>()(query, {
        variables: {
            email: filterApi.current.email,
            name: filterApi.current.name,
            username: filterApi.current.username,
            website: filterApi.current.website?.url,
            pathFunction,
        },
        resolveTableData: (data) => ({
            data: data.users,
            totalCount: data.users.length,
        }),
    });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            <TableFilterFinalForm filterApi={filterApi}>
                <Typography variant="h5">FilterBar</Typography>
                <FilterBar>
                    <FilterBarPopoverFilter label={"Username"}>
                        <Field name="username" type="text" component={FinalFormInput} fullWidth />
                    </FilterBarPopoverFilter>
                    <FilterBarMoreFilters>
                        <FilterBarPopoverFilter label={"Email"}>
                            <ExampleWithSelect />
                        </FilterBarPopoverFilter>
                        <FilterBarPopoverFilter label={"Name"}>
                            <Field name="name" type="text" component={FinalFormInput} fullWidth />
                        </FilterBarPopoverFilter>
                        <FilterBarPopoverFilter label={"Website"}>
                            <Field name="website.url" type="text" component={FinalFormInput} fullWidth />
                            <Field name="website.name" type="text" component={FinalFormInput} fullWidth />
                        </FilterBarPopoverFilter>
                    </FilterBarMoreFilters>
                </FilterBar>
            </TableFilterFinalForm>
            Current Filters: {JSON.stringify(filterApi.current)}
            {tableData && (
                <Table
                    {...tableData}
                    columns={[
                        {
                            name: "name",
                            header: "Name",
                        },
                        {
                            name: "username",
                            header: "Username",
                        },
                        {
                            name: "email",
                            header: "E-Mail",
                        },
                        {
                            name: "phone",
                            header: "TelNr.",
                        },
                        {
                            name: "website",
                            header: "Homepage",
                        },
                    ]}
                />
            )}
        </TableQuery>
    );
}

storiesOf("@comet/admin/table", module)
    .addDecorator(apolloStoryDecorator())
    .add("Table with Filterbar", () => <Story />);
