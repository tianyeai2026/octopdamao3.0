interface MascotImageProps {
  src: string;
}

export default function MascotImage({ src }: MascotImageProps) {
  return (
    <img
      className="mascot-image"
      src={src}
      alt="全全老师"
      draggable={false}
    />
  );
}
