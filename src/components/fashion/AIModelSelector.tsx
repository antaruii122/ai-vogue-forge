import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Check } from "lucide-react";
import aiModel1 from "@/assets/ai-model-1.png";
import aiModel2 from "@/assets/ai-model-2.png";
import aiModel3 from "@/assets/ai-model-3.png";
import aiModel4 from "@/assets/ai-model-4.png";
import aiModel5 from "@/assets/ai-model-5.png";
import aiModel6 from "@/assets/ai-model-6.png";
import aiModel7 from "@/assets/ai-model-7.png";
import aiModel8 from "@/assets/ai-model-8.png";
import aiModel9 from "@/assets/ai-model-9.png";
import aiModel10 from "@/assets/ai-model-10.png";

const aiModels = [
  { id: 1, name: "Model 1", image: aiModel1 },
  { id: 2, name: "Model 2", image: aiModel2 },
  { id: 3, name: "Model 3", image: aiModel3 },
  { id: 4, name: "Model 4", image: aiModel4 },
  { id: 5, name: "Model 5", image: aiModel5 },
  { id: 6, name: "Model 6", image: aiModel6 },
  { id: 7, name: "Model 7", image: aiModel7 },
  { id: 8, name: "Model 8", image: aiModel8 },
  { id: 9, name: "Model 9", image: aiModel9 },
  { id: 10, name: "Model 10", image: aiModel10 },
];

interface AIModelSelectorProps {
  isModalOpen: boolean;
  selectedAiModel: number | null;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onSelectModel: (modelId: number) => void;
}

export const AIModelSelector = ({
  isModalOpen,
  selectedAiModel,
  onOpenModal,
  onCloseModal,
  onSelectModel,
}: AIModelSelectorProps) => {
  const getSelectedModelInfo = () => {
    return aiModels.find(m => m.id === selectedAiModel);
  };

  return (
    <>
      {/* AI Model Button */}
      <Button
        onClick={onOpenModal}
        variant="outline"
        className="w-full py-4 border-2 border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400 text-purple-300 hover:text-purple-200 transition-all duration-300"
      >
        <Users className="mr-2 h-5 w-5" />
        Don&apos;t have a model? Choose from our AI Models
      </Button>

      {/* Selected AI Model Display */}
      {selectedAiModel && (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-4">
            <img
              src={getSelectedModelInfo()?.image}
              alt={getSelectedModelInfo()?.name}
              className="w-16 h-24 object-cover rounded-lg border border-purple-500/50"
            />
            <div className="flex-1">
              <p className="text-foreground font-medium">
                {getSelectedModelInfo()?.name} selected
              </p>
              <button
                onClick={onOpenModal}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors mt-1"
              >
                Change model
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Model Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={onCloseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-400" />
              Choose Your AI Model
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {aiModels.map((model) => (
              <div
                key={model.id}
                className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 border-2 aspect-[9/16]
                  ${selectedAiModel === model.id 
                    ? 'border-purple-500 scale-[1.02] shadow-xl shadow-purple-500/40' 
                    : 'border-gray-700 hover:border-purple-400/50 hover:scale-[1.01]'
                  }`}
                onClick={() => onSelectModel(model.id)}
              >
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-medium text-center">{model.name}</p>
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectModel(model.id);
                    }}
                  >
                    Select This Model
                  </Button>
                </div>
                {selectedAiModel === model.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
