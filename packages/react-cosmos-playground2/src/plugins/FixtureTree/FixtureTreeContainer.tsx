import React, { useMemo } from 'react';
import { createFixtureTree } from 'react-cosmos-shared2/fixtureTree';
import { FixtureId, FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { IconButton32 } from '../../shared/buttons';
import { grey128, grey32, white10 } from '../../shared/colors';
import { MinusSquareIcon, PlusSquareIcon } from '../../shared/icons';
import { hasNonEmptyDirs } from '../../shared/tree';
import {
  getFullTreeExpansion,
  isTreeFullyCollapsed,
} from '../../shared/treeExpansion';
import { TreeExpansion } from '../../shared/TreeView';
import { BlankState } from './BlankState';
import { FixtureTree } from './FixtureTree';
import { useScrollToSelected } from './useScrollToSelected';

type Props = {
  projectId: string;
  fixturesDir: string;
  fixtureFileSuffix: string;
  selectedFixtureId: null | FixtureId;
  rendererConnected: boolean;
  fixtures: FixtureNamesByPath;
  treeExpansion: TreeExpansion;
  selectFixture: (fixtureId: FixtureId) => void;
  setTreeExpansion: (treeExpansion: TreeExpansion) => unknown;
};

export function FixtureTreeContainer({
  projectId,
  fixturesDir,
  fixtureFileSuffix,
  selectedFixtureId,
  rendererConnected,
  fixtures,
  treeExpansion,
  selectFixture,
  setTreeExpansion,
}: Props) {
  const rootNode = useMemo(
    () => createFixtureTree({ fixtures, fixturesDir, fixtureFileSuffix }),
    [fixtures, fixturesDir, fixtureFileSuffix]
  );
  const { containerRef, selectedRef } = useScrollToSelected(selectedFixtureId);

  if (!rendererConnected) return <TreeContainer />;

  if (Object.keys(fixtures).length === 0) {
    return (
      <TreeContainer>
        <BlankState
          fixturesDir={fixturesDir}
          fixtureFileSuffix={fixtureFileSuffix}
        />
      </TreeContainer>
    );
  }

  return (
    <>
      <Menu>
        <ProjectName title={projectId}>{projectId}</ProjectName>
        {!hasNonEmptyDirs(rootNode) ? (
          <IconButton32
            title="Collapse all fixture tree folders"
            icon={<MinusSquareIcon />}
            disabled
            onClick={() => {}}
          />
        ) : isTreeFullyCollapsed(treeExpansion) ? (
          <IconButton32
            title="Expand all fixture tree folders"
            icon={<PlusSquareIcon />}
            onClick={() => setTreeExpansion(getFullTreeExpansion(rootNode))}
          />
        ) : (
          <IconButton32
            title="Collapse all fixture tree folders"
            icon={<MinusSquareIcon />}
            onClick={() => setTreeExpansion({})}
          />
        )}
      </Menu>
      <TreeContainer ref={containerRef}>
        <FixtureTree
          rootNode={rootNode}
          selectedFixtureId={selectedFixtureId}
          treeExpansion={treeExpansion}
          selectedRef={selectedRef}
          onSelect={selectFixture}
          setTreeExpansion={setTreeExpansion}
        />
      </TreeContainer>
    </>
  );
}

const Menu = styled.div`
  flex-shrink: 0;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  border-bottom: 1px solid ${white10};
  background: ${grey32};
`;

const ProjectName = styled.div`
  padding: 0 4px 0 20px;
  color: ${grey128};
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// The background color is required for the proper scroll bar color theme
const TreeContainer = styled.div`
  flex: 1;
  background: ${grey32};
  overflow: auto;
`;
