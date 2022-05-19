import { Clear } from "@comet/admin-icons";
import { autocompleteClasses } from "@mui/material";
import * as React from "react";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiAutocomplete: GetMuiComponentTheme<"MuiAutocomplete"> = (component, { spacing }) => ({
    ...component,
    defaultProps: {
        clearIcon: <Clear color="action" />,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiAutocomplete">(component?.styleOverrides, {
        endAdornment: {
            top: 0,
            bottom: 0,
            right: spacing(2),
            display: "flex",
        },
        hasPopupIcon: {
            [`&.${autocompleteClasses.root} .${autocompleteClasses.inputRoot}`]: {
                paddingRight: 26,
            },
        },
        popupIndicator: {
            "&:hover": {
                backgroundColor: "transparent",
            },
        },
    }),
});
