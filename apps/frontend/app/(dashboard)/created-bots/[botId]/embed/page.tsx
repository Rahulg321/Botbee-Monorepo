import React from "react";
import WidgetBuilder from "./widget-builder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embed Bot",
  description: "Embed your bot in your website",
};

const page = () => {
  return (
    <div>
      <WidgetBuilder />
    </div>
  );
};

export default page;
