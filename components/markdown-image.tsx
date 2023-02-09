import Image, { ImageLoaderProps, ImageProps } from "next/image";

export const rootPath = "https://res.cloudinary.com/piith/image/upload/";

export enum Dimensions {
  MediumPortrait = "medium-portrait",
  MediumLandscape = "medium-landscape",
}

export enum Align {
  Center = "center",
  Left = "left",
  Right = "right",
}

export const dimensionsMap = {
  [Dimensions.MediumPortrait]: [300, 600],
  [Dimensions.MediumLandscape]: [600, 300],
};

const getSearchParams = (url: string) => {
  const hashIndex = url.indexOf("#");
  return new URLSearchParams(hashIndex === -1 ? "" : url.slice(hashIndex + 1));
};

export const getCloudinaryLoader =
  (width: number, height: number) =>
  ({ src, quality }: ImageLoaderProps): string => {
    const params = [
      "f_auto",
      "c_fill",
      "w_" + width,
      "h_" + height,
      "q_" + (quality || "auto"),
    ];
    const paramsString = params.join(",") + "/";
    return `${rootPath}${paramsString}${src}`;
  };

const MarkdownImage: React.FC<ImageProps> = ({ children, src, ...props }) => {
  const source = src.toString();
  const fileName = source.replace(rootPath, "");
  const isCloudImage =
    source.length !== fileName.length && !props.width && !props.height;
  const searchParams = getSearchParams(source);
  const [width, height] =
    dimensionsMap[searchParams.get("dimensions")] ||
    dimensionsMap[Dimensions.MediumLandscape];

  return isCloudImage ? (
    <Image
      {...props}
      loader={getCloudinaryLoader(width, height)}
      src={fileName}
      width={width}
      height={height}
    >
      {children}
    </Image>
  ) : (
    <img {...props} src={source}>
      {children}
    </img>
  );
};

export default MarkdownImage;
