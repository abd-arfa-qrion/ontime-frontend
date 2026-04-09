import React from "react";
import styles from "./Websitelayout.module.scss";
import FooterPage from "@/components/view/website/footer";

type Proptypes = {
  children: React.ReactNode;
};

const WebsiteLayout = (props: Proptypes) => {
  const { children } = props;
  return (
    <div>
      <div>{children}</div>
      
      <FooterPage />
    </div>
  );
};

export default WebsiteLayout;
