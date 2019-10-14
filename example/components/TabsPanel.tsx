import * as React from "react";
import styled from "@emotion/styled";

const { FC, useState, useCallback, ReactNode } = React;

const TabSetHolder = styled.section`
  position: relative;
  width: 100%;
`;

const TabSet = styled.section`
  width: inherit;
  background-color: #7b68ee;
  display: flex;
  color: white;
  position: fixed;
  top: 0;
  z-index: 1;
`;

const TabItem = styled.div<{ active?: boolean }>`
  background-color: #7b68ee;
  padding: 20px 30px;
  position: relative;
  transition: 0.1s all;
  cursor: pointer;
  &:hover {
    background-color: #5b43ea;
    &:after {
      border-top: 10px solid #5b43ea;
    }
  }
  &:after {
    ${({ active }) =>
      active &&
      `
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #7b68ee;
      bottom: -10px;
      left: 40%;
    `}
  }
`;

const TabContent = styled.main`
  position: relative;
  top: 60px;
`;

const TabsPanel: FC<{ tabs: { [key: string]: ReactNode } }> = ({ tabs = {} }) => {
  const [activeTabIndex, setActiveTab] = useState(2);

  const handleTabChange = useCallback(
    (tabIndex: number) => () => {
      setActiveTab(tabIndex);
    },
    []
  );

  const getActiveTabContent = useCallback(() => {
    const activeTab = Object.entries(tabs).find((tab, index) => activeTabIndex === index);
    return activeTab ? activeTab[1] : null;
  }, [activeTabIndex, tabs]);

  return (
    <TabSetHolder>
      <TabSet>
        {Object.entries(tabs).map(([tab], index) => (
          <TabItem onClick={handleTabChange(index)} key={index} active={activeTabIndex === index}>
            {tab}
          </TabItem>
        ))}
      </TabSet>
      <TabContent>{getActiveTabContent()}</TabContent>
      <TabContent />
    </TabSetHolder>
  );
};

export default TabsPanel;
