import Image, { ImageLoaderProps, ImageProps } from "next/image";

export const rootPath = "https://res.cloudinary.com/piith/image/upload/";

export enum Dimensions {
  Thumbnail = "thumbnail",
  SmallLandscape = "small-landscape",
  SmallPortrait = "small-portrait",
  MediumLandscape = "medium-landscape",
  MediumPortrait = "medium-portrait",
  LargeLandscape = "large-landscape",
  LargePortrait = "large-portrait",
}

export enum Align {
  Center = "center",
  Left = "left",
  Right = "right",
}

export const dimensionsMap = {
  [Dimensions.Thumbnail]: [48, 48],
  [Dimensions.SmallLandscape]: [133, 100],
  [Dimensions.SmallPortrait]: [100, 133],
  [Dimensions.MediumLandscape]: [320, 240],
  [Dimensions.MediumPortrait]: [240, 320],
  [Dimensions.LargeLandscape]: [745, 559],
  [Dimensions.LargePortrait]: [559, 745],
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
