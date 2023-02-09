import CMS from "netlify-cms-app";
import type { CmsConfig } from "netlify-cms-core";
import cloudinary from "netlify-cms-media-library-cloudinary";

import cmsConfig from "../cms.json";
import cmsImage from "../components/cms-image";

const config = cmsConfig as CmsConfig;

CMS.init({ config });
CMS.registerMediaLibrary(cloudinary);
CMS.registerEditorComponent({
  id: "read-more",
  label: "Read more",
  pattern: /^<!--more-->$/,
  fields: [],
  fromBlock: () => ({}),
  toBlock: () => "<!--more-->",
  toPreview: () => "<hr />",
});

CMS.registerEditorComponent(cmsImage);

const Cms: React.FC = () => {
  return <></>;
};

export default Cms;
