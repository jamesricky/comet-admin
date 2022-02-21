import { Components } from "@mui/material/styles/components";
import { Spacing } from "@mui/system";

export const getMuiDialog = (spacing: Spacing): Components["MuiDialog"] => ({
    styleOverrides: {
        paper: {
            borderRadius: 4,
            width: "100%",
            margin: spacing(8),
        },
        paperScrollPaper: {
            maxHeight: `calc(100% - ${spacing(16)})`,
        },
        paperWidthXs: {
            maxWidth: 350,
        },
        paperWidthSm: {
            maxWidth: 600,
        },
        paperWidthMd: {
            maxWidth: 1024,
        },
        paperWidthLg: {
            maxWidth: 1280,
        },
        paperWidthXl: {
            maxWidth: 1920,
        },
        paperFullWidth: {
            width: `calc(100% - ${spacing(16)})`,
        },
    },
});
