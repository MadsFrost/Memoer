import React from 'react'

export interface StepperProps {
    children: React.ReactNode[];
    activeStep: number;
}
const Stepper: React.FC<StepperProps> = ({ children, activeStep }) => {
    return (
        <div className='flex justify-center items-center py-6'>
            {children.map((child, index) => {
                    if (index === activeStep) {
                        return child
                    }
                }
            )}
        </div>
    )
}

export default Stepper