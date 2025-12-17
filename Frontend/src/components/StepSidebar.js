const steps = [
  "Heading",
  "Education",
  "Experience",
  "Skills",
  "Summary",
  "Finalize",
];

const StepSidebar = ({ currentStep = 1 }) => {
  return (
    <div className="h-full bg-[#0f172a] text-white p-5">
      <div className="mb-8">
        <h2 className="text-xl font-bold">RecruBotX</h2>
      </div>

      <ul className="space-y-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const active = stepNumber === currentStep;

          return (
            <li key={step} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm
                ${active ? "bg-white text-black" : "border border-gray-400"}`}
              >
                {stepNumber}
              </div>
              <span className={active ? "font-semibold" : "text-gray-300"}>
                {step}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-10">
        <p className="text-xs text-gray-400 mb-1">Resume Completeness</p>
        <div className="w-full bg-gray-700 h-2 rounded">
          <div className="bg-green-500 h-2 rounded w-[40%]" />
        </div>
      </div>
    </div>
  );
};

export default StepSidebar;
