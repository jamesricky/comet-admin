import { Field, FieldContainer } from "@comet/admin";
import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";
import { FormattedDate } from "react-intl";

function Story() {
    const initialValues = {
        foo: "FooValue",
        bar: "BarValue",
    };
    return (
        <div style={{ width: "500px" }}>
            <Form
                onSubmit={(values) => {
                    //
                }}
                initialValues={initialValues}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Typography>Render field value as static text (using MUI Typography)</Typography>
                        <Field name="foo" label="Foo">
                            {(fieldRenderProps) => <Typography>{fieldRenderProps.input.value}</Typography>}
                        </Field>

                        <Typography>
                            Or, simpler, if the value isn&apos;t part of the form (doesn&apos;t change), render it without final-form:
                        </Typography>
                        <FieldContainer label="Bar">
                            <Typography>{initialValues.bar}</Typography>
                        </FieldContainer>

                        <Typography>Of course you can use any formatting:</Typography>
                        <FieldContainer label="Today">
                            <Typography>
                                <FormattedDate value={new Date()} />
                            </Typography>
                        </FieldContainer>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Typography Static Text in Form", () => <Story />);
