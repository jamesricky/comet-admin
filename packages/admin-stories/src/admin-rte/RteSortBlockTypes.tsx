import { IRteOptions, makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

const rteOptions: IRteOptions = {
    sortBlockTypes: () => ["header-two", "unstyled", "header-three"],
};

const [useRteApi] = makeRteApi();

function Story() {
    const { editorState, setEditorState } = useRteApi();

    return (
        <>
            <Box marginBottom={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Rte value={editorState} onChange={setEditorState} options={rteOptions} />
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}

storiesOf("@comet/admin-rte", module).add("Rte, sort block types", () => <Story />);
