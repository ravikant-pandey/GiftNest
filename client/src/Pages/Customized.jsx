import { Stage, Layer, Image, Text, Transformer } from "react-konva";
import { useEffect, useRef, useState, useContext } from "react";
import useImage from "use-image";
import { useParams } from "react-router-dom";
import Title from "../Components/Title/Title";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-hot-toast";

const DESIGN_WIDTH = 500;
const DESIGN_HEIGHT = 420;

export default function GiftEditor() {
  const { id } = useParams();
  const { products, addToCart } = useContext(AppContext);

  const stageRef = useRef(null);
  const trRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  const productData = products.find((p) => p._id == id);

  // ⭐ FIX 1 — images instead of image
  const [baseImage] = useImage(productData?.images?.[0]);

  const [userImageURL, setUserImageURL] = useState(null);
  const [userImage] = useImage(userImageURL);

  const [text, setText] = useState("My Gift");
  const [selected, setSelected] = useState(null);
  const [scale, setScale] = useState(1);

  // Responsive canvas scale
  useEffect(() => {
    if (!containerRef.current) return;

    const resize = () => {
      const width = containerRef.current.offsetWidth;
      const safeWidth = Math.min(width, DESIGN_WIDTH);
      setScale(safeWidth / DESIGN_WIDTH);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Transformer selection
  useEffect(() => {
    if (!trRef.current) return;
    if (selected === "image" && imgRef.current)
      trRef.current.nodes([imgRef.current]);
    if (selected === "text" && textRef.current)
      trRef.current.nodes([textRef.current]);
  }, [selected]);

  const handleAddToCart = () => {
    const designImage = stageRef.current.toDataURL({ pixelRatio: 3 });

    addToCart({
      productId: productData._id,
      name: productData.title, // ⭐ FIX 2 — title instead of name
      price: productData.price,
      customText: text,
      customDesign: designImage,
      quantity: 1,
    });

    toast.success("Customized product added to cart");
  };

  if (!productData) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Header */}
      <div className="w-full bg-white shadow-sm py-6">
        <div className="max-w-[1400px] text-2xl md:text-3xl mx-auto text-center px-4">
          <Title text1="Customize" text2={productData.title} />
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row">
        {/* Left Panel */}
        <div className="w-full md:w-[360px] bg-white shadow p-4 space-y-4">
          <label className="block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setUserImageURL(URL.createObjectURL(e.target.files[0]));
                  setSelected("image");
                }
              }}
            />
            <p className="text-sm font-medium">Upload Image</p>
          </label>

          <input
            className="w-full border rounded px-3 py-2"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setSelected("text");
            }}
            placeholder="Enter text"
          />

          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-3 rounded-lg sticky bottom-0 md:static"
          >
            Add to Cart
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <div ref={containerRef} className="w-full mt-10 max-w-[520px]">
            <Stage
              ref={stageRef}
              width={DESIGN_WIDTH}
              height={DESIGN_HEIGHT}
              scaleX={scale}
              scaleY={scale}
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}`,
              }}
              onMouseDown={() => setSelected(null)}
              onTouchStart={() => setSelected(null)}
            >
              <Layer>
                {/* ⭐ FIX 3 — full canvas height */}
                {baseImage && (
                  <Image
                    image={baseImage}
                    width={DESIGN_WIDTH}
                    height={DESIGN_HEIGHT}
                    listening={false}
                  />
                )}

                {userImage && (
                  <Image
                    ref={imgRef}
                    image={userImage}
                    x={150}
                    y={150}
                    width={120}
                    height={120}
                    draggable
                    onClick={() => setSelected("image")}
                    onTap={() => setSelected("image")}
                  />
                )}

                <Text
                  ref={textRef}
                  text={text}
                  x={180}
                  y={280}
                  fontSize={20}
                  draggable
                  onClick={() => setSelected("text")}
                  onTap={() => setSelected("text")}
                />

                <Transformer ref={trRef} />
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
}
