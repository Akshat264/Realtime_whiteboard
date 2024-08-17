import { useEffect, useState, useLayoutEffect } from "react";
import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";

const roughGenerator = rough.generator();

const Whiteboard = ({ canvasRef, ctxRef, elements, setElements, tool, setTool, color, user, socket }) => {
    const [img, setImg] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        socket.on("whiteBoardDataResponse", (data) => {
            setImg(data.imgURL);
        });
    }, [socket]);

    useEffect(() => {
        if (!user?.presenter) return; // Skip canvas setup if not presenter

        const canvas = canvasRef.current;
        canvas.height = window.innerHeight * 2;
        canvas.width = window.innerWidth * 2;
        const ctx = canvas?.getContext("2d");
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctxRef.current = ctx;
    }, [canvasRef, color, ctxRef, user]);

    useEffect(() => {
        if (ctxRef.current) {
            ctxRef.current.strokeStyle = color;
        }
    }, [color]);

    useLayoutEffect(() => {
        if (!canvasRef || !user?.presenter) return; // Skip drawing if not presenter

        const roughgen = rough.canvas(canvasRef.current);
        if (elements.length > 0) {
            ctxRef.current.clearRect(
                0, 0, canvasRef?.current?.width, canvasRef?.current?.height
            );
        }
        elements.forEach((element) => {
            if (element.type === "rect") {
                roughgen.draw(
                    roughGenerator.rectangle(
                        element.offsetX,
                        element.offsetY,
                        element.width,
                        element.height,
                        {
                            stroke: element.stroke,
                            strokeWidth: 5,
                            roughness: 0,
                        }
                    )
                );
            } else if (element.type === "line") {
                roughgen.draw(roughGenerator.line(element.offsetX, element.offsetY, element.width, element.height, {
                    stroke: element.stroke,
                    strokeWidth: 5,
                    roughness: 0,
                }));
            } else if (element.type === "pencil") {
                roughgen.linearPath(element.path, {
                    stroke: element.stroke,
                    strokeWidth: 5,
                    roughness: 0,
                });
            }
        });
        const canvasImage = canvasRef.current.toDataURL();
        socket.emit("WhiteboardData", canvasImage);
    }, [elements, canvasRef, user, socket]);
    if (!user?.presenter) {
        return (
            <div className="border border-dark border-3 h-100 w-100 overflow-hidden">
                <img src={img} style={{ height: window.innerHeight * 2, width: "280%" }} />
            </div>
        );
    }
    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        if (tool === "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "pencil",
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: color,
                },
            ]);
        } else if (tool === "line") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "line",
                    offsetX,
                    offsetY,
                    width: offsetX,
                    height: offsetY,
                    stroke: color,
                },
            ]);
        } else if (tool === "rect") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "rect",
                    offsetX,
                    offsetY,
                    width: 0,
                    height: 0,
                    stroke: color,
                },
            ]);
        }
        setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        if (isDrawing) {
            setElements((prevElements) =>
                prevElements.map((ele, index) => {
                    if (index === elements.length - 1) {
                        if (tool === "pencil") {
                            const newPath = [...ele.path, [offsetX, offsetY]];
                            return {
                                ...ele,
                                path: newPath,
                            };
                        } else if (tool === "line") {
                            return {
                                ...ele,
                                width: offsetX,
                                height: offsetY,
                            };
                        } else if (tool === "rect") {
                            return {
                                ...ele,
                                width: offsetX - ele.offsetX,
                                height: offsetY - ele.offsetY,
                            };
                        }
                    }
                    return ele;
                })
            );
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="border border-dark border-3 h-100 w-100 overflow-hidden"
        >
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Whiteboard;
