import React, { useState, useEffect } from 'react'
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Fraction } from 'fraction.js';


import { sampletestdata }  from '../lib/data.js'

type testQuestiondProps = {
    module: number,
    number: number;
    answers: any[],
    handleA: (option: any) => void;
};



const TestQuestion: React.FC<testQuestiondProps> = ({module, number, answers, handleA}) => {
    const [text, setText] = useState("");
    const [fractionValue, setFractionValue] = useState<Fraction | null>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[-0-9./]*$/.test(value)) {
            setText(value);
            try {
                const fraction = new Fraction(value); // Convert input to a fraction
                setFractionValue(fraction);
                handleA(fraction.toFraction()); // Pass the fraction as a string like "1/2"
            } catch (err) {
                setFractionValue(null); // Handle invalid input
            }
        }
    };
    
    useEffect(() => {
        if (answers[number]){
            setText(answers[number]);
        } else {
            setText("")
        }
        setFractionValue(null);
    }, [module, number]);

    console.log(answers)
    return (
    <div className='text-gray-100 flex p-6 my-5 mx-48 bg-gray-800 rounded-lg h-[65vh] shadow-lg'>
        <div className='py-5 px-5 flex-1'>
            <div className='whitespace-pre-wrap'>{number + 1}. {sampletestdata[module][number].passage}</div>
            <div className='max-w-[650px] max-auto relative m-4 mx-auto'>
            {sampletestdata[module][number].img && <Image
                src={`/Q${number+1}Mod${module+1}.png`}// Replace with your image path
                layout="responsive"
                alt="data"
                width={1200} // The original width of the image
                height={800} // The original height of the image
                style={{
                  objectFit: 'contain',
                  maxHeight: '450px',
                  width: '100%',
                }}

            />
            }
            </div>
        </div>

        <div className='w-[1px] absolute left-1/2 -translate-x-1/2 bg-gray-100 h-[60vh]'>
        </div>

        <div className='py-5 px-5 ml-5 flex-1'>
            <div className=''>
                <div className='mb-5'>{sampletestdata[module][number].question}</div>
                {
                    ('fr' in sampletestdata[module][number]) ? 

                    <Input type="text" value={text} placeholder="Enter text..." onChange={handleChange}
                    className="w-40 text-sm p-2 text-black" /> :

                    <>
                    <div onClick={() => handleA('A')} className={`border-2 border-gray-100 rounded-2xl mr-10 mb-4 p-4 flex items-center cursor-pointer ${answers[number] == 'A' ? 'bg-gray-100 text-black hover:bg-gray-100' : 'hover:bg-gray-700 text-gray-100 hover:bg-gray-800'}`}>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-black
                            text-xl flex-shrink-0 mr-4 ${answers[number] == 'A' ? 'bg-gray-100 text-black border-black' : ' text-gray-100 border-gray-100'}`}>A</div>
                        <div>{sampletestdata[module][number].choice1}</div>
                    </div>
                    <div onClick={() => handleA('B')} className={`border-2 border-gray-100 rounded-2xl mr-10 mb-4 p-4 flex items-center cursor-pointer ${answers[number] == 'B' ? 'bg-gray-100 text-black hover:bg-gray-100' : 'hover:bg-gray-700 text-gray-100 hover:bg-gray-800'}`}>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-black
                            text-xl flex-shrink-0 mr-4 ${answers[number] == 'B' ? 'bg-gray-100 text-black border-black' : 'hover:bg-gray-700 text-gray-100 border-gray-100'}`}>B</div>
                        <div>{sampletestdata[module][number].choice2}</div>
                    </div>
                    <div onClick={() => handleA('C')} className={`border-2 border-gray-100 rounded-2xl mr-10 mb-4 p-4 flex items-center cursor-pointer ${answers[number] == 'C' ? 'bg-gray-100 text-black hover:bg-gray-100' : 'hover:bg-gray-700 text-gray-100 hover:bg-gray-800'}`}>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-black
                            text-xl flex-shrink-0 mr-4 ${answers[number] == 'C' ? 'bg-gray-100 text-black border-black' : 'text-gray-100 border-gray-100'}`}>C</div>
                        <div>{sampletestdata[module][number].choice3}</div>
                    </div>
                    <div onClick={() => handleA('D')} className={`border-2 border-gray-100 rounded-2xl mr-10 mb-4 p-4 flex items-center cursor-pointer ${answers[number] == 'D' ? 'bg-gray-100 text-black hover:bg-gray-100' : 'hover:bg-gray-700 text-gray-100 hover:bg-gray-800'}`}>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-black
                            text-xl flex-shrink-0 mr-4 ${answers[number] == 'D' ? 'bg-gray-100 text-black border-black' : 'text-gray-100 border-gray-100'}`}>D</div>
                        <div>{sampletestdata[module][number].choice4}</div>
                    </div>
                    </>
                }

            </div>
        </div>


    </div>
  )
}

export default TestQuestion