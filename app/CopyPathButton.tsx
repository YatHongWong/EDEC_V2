import { EmptyCopyIcon, FilledCopyIcon } from "@/src/components/Icons";
import { useState } from "react";

type CopyPathButtonProps = {
    path: string;
};

export default function CopyPathButton(props: CopyPathButtonProps) {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    function handleClick() {
        setButtonClicked(true);
        navigator.clipboard.writeText(props.path);

        setTimeout(() => {
            setButtonClicked(false);
            setTooltipVisible(false);
        }, 500);

    }
    function handleMouseEnter() {
        setTooltipVisible(true);
    }

    function handleMouseLeave() {
        setTooltipVisible(false);
    }

    return (
        <button onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative inline-block align-middle cursor-pointer w-5">
            {
                buttonClicked ? <FilledCopyIcon /> : <EmptyCopyIcon />
            }
            {
                tooltipVisible ?
                    <p className="absolute bg-gray-600/50 backdrop-blur-sm text-white text-sm rounded-sm p-1 left-1/2 -translate-x-1/2 bottom-full w-24 text-center">
                        {buttonClicked ? "Copied!" : "Click to copy"}</p> :
                    null
            }
        </button>
    )
}
