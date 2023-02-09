import { Align, Dimensions, dimensionsMap, rootPath } from "./markdown-image";

type ImageData = {
  alt: string;
  image: string;
  title: string;
  dimensions: string;
  align: string;
};

const getParams = (dimensions, align) => {
  const searchParams = new URLSearchParams();
  searchParams.set("dimensions", dimensions);
  searchParams.set("align", align);
  return searchParams.toString() ? `#${searchParams.toString()}` : "";
};

const fromBlock = (match: string[]): ImageData =>
  match && {
    image: match[3],
    alt: match[1],
    title: match[8],
    dimensions: match[5],
    align: match[6],
  };

const toBlock = ({ alt, image, title, dimensions, align }: ImageData): string =>
  `![${alt || ""}](${image || ""}${getParams(dimensions, align)}${
    title ? ` "${title.replace(/"/g, '\\"')}"` : ""
  })`;

const toPreview: React.FC<ImageData> = ({
  alt,
  image,
  title,
  dimensions,
  align,
}) => {
  const fileName = image.replace(rootPath, "");
  const [width, height] =
    dimensionsMap[dimensions || Dimensions.MediumLandscape];
  const params = ["f_auto", "c_fill", "w_" + width, "h_" + height, "q_auto"];
  const paramsString = params.join(",") + "/";
  return (
    <img
      src={`${rootPath}${paramsString}${fileName}${getParams(
        dimensions,
        align
      )}`}
      width={width}
      height={height}
      alt={alt || ""}
      title={title || ""}
    />
  );
};

const cmsImageConfig = {
  label: "Image Formatted",
  id: "image-formatted",
  fromBlock,
  toBlock,
  toPreview: toPreview as unknown as (props: ImageData) => string,
  pattern: /^!\[(.*)\]\(((.*?)(#dimensions=(.*?)&align=(.*?))?)(\s"(.*)")?\)$/,
  fields: [
    {
      label: "Image Formatted",
      name: "image",
      widget: "image",
      media_library: {
        allow_multiple: false,
      },
    },
    {
      label: "Alt Text",
      name: "alt",
      widget: "text",
    },
    {
      label: "Title",
      name: "title",
      widget: "text",
    },
    {
      label: "Dimensions",
      name: "dimensions",
      widget: "select",
      options: Object.values(Dimensions),
    },
    {
      label: "align",
      name: "align",
      widget: "select",
      options: Object.values(Align),
    },
  ],
};

export default cmsImageConfig;
