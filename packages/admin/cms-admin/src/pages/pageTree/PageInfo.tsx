import { TreeCollapse, TreeExpand } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

import { PageTreePage } from "./usePageTree";

interface PageInfoProps {
    page: PageTreePage;
    toggleExpand: (id: string) => void;
    children: React.ReactNode;
}

export default function PageInfo({ page, toggleExpand, children }: PageInfoProps): React.ReactElement {
    return (
        <Root style={{ paddingLeft: `${page.level * 33}px` }}>
            <ExpandIconWrapper>
                {page.expanded !== null && (
                    <IconButton
                        onClick={() => {
                            toggleExpand(page.id);
                        }}
                        size="large"
                    >
                        {page.expanded ? <TreeCollapse /> : <TreeExpand />}
                    </IconButton>
                )}
            </ExpandIconWrapper>
            <ChildrenWrapper>{children}</ChildrenWrapper>
        </Root>
    );
}

const Root = styled("div")`
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
`;

const ExpandIconWrapper = styled("div")`
    width: 44px;
    flex-shrink: 0;
`;

const ChildrenWrapper = styled("div")`
    min-width: 0;
`;
