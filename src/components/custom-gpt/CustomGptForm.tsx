
import React from 'react';
import { Form } from "@/components/ui/form";
import { CustomGptFormProps } from './types';
import { useCustomGptForm } from './hooks/useCustomGptForm';
import SimpleGenerator from './SimpleGenerator';
import AdvancedGenerator from './AdvancedGenerator';

const CustomGptForm: React.FC<CustomGptFormProps> = ({ 
  onResults, 
  onScriptGenerated, 
  initialData, 
  mode = 'simple' 
}) => {
  const {
    form,
    isSubmitting,
    selectedType,
    setSelectedType,
    selectedEquipment,
    setSelectedEquipment,
    selectedObjective,
    setSelectedObjective,
    results,
    setResults,
    showAdvancedFields,
    setShowAdvancedFields,
    equipments,
    equipmentsLoading,
    handleSubmit,
    handleQuickGenerate
  } = useCustomGptForm(onResults, onScriptGenerated, initialData, mode);

  return (
    <div>
      {mode === 'simple' ? (
        <>
          <SimpleGenerator
            selectedEquipment={selectedEquipment}
            setSelectedEquipment={setSelectedEquipment}
            selectedObjective={selectedObjective}
            setSelectedObjective={setSelectedObjective}
            equipments={equipments}
            equipmentsLoading={equipmentsLoading}
            handleQuickGenerate={handleQuickGenerate}
            isSubmitting={isSubmitting}
            results={results}
            setResults={setResults}
            showAdvancedFields={showAdvancedFields}
            setShowAdvancedFields={setShowAdvancedFields}
          />
          
          {showAdvancedFields && (
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <AdvancedGenerator
                  form={form}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  selectedEquipment={selectedEquipment}
                  setSelectedEquipment={setSelectedEquipment}
                  equipments={equipments}
                  equipmentsLoading={equipmentsLoading}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </form>
            </Form>
          )}
        </>
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdvancedGenerator
              form={form}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment}
              equipments={equipments}
              equipmentsLoading={equipmentsLoading}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      )}
    </div>
  );
};

export default CustomGptForm;
