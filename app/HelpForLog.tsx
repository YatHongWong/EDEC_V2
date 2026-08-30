import { useState } from "react";
import { EmptyHelpIcon, FilledHelpIcon } from "@/src/components/Icons";


export default function HelpButtonForLog() {

    const [showHelp, setShowHelp] = useState(false);
    const [iconType, setIconType] = useState<'empty' | 'filled'>('empty');


    function toggleHelp(bool: boolean) {
        setShowHelp(bool)
        if (bool) {
            setIconType('filled');
        } else {
            setIconType('empty');
        }
    }

    return (

        <div className="cursor-pointer" onMouseEnter={() => toggleHelp(true)} onMouseLeave={() => toggleHelp(false)}>
            {iconType === 'empty' ? <EmptyHelpIcon /> : <FilledHelpIcon />}

            <div className="absolute m-2">
                {showHelp ? "This is the help text for the log file." : null}
            </div>

        </div>


    )

}