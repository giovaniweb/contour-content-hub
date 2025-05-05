
import React from 'react';
import { Form } from "@/components/ui/form";
import { CustomGptFormProps } from './types';
import { useCustomGptForm } from './hooks/useCustomGptForm';
import SimpleGenerator from './SimpleGenerator';
import AdvancedGenerator from './AdvancedGenerator';
import AdvancedOptions from './AdvancedOptions';
import ResultDisplay from './ResultDisplay';

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
    <div className="space-y-6">
      {mode === 'simple' ? (
        <>
          <SimpleGenerator
            selectedType={selectedType}
            setSelectedType={setSelectedType}
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
                <AdvancedOptions 
                  form={form} 
                  showAdvancedFields={showAdvancedFields} 
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
              selectedObjective={selectedObjective}
              setSelectedObjective={setSelectedObjective}
              equipments={equipments}
              equipmentsLoading={equipmentsLoading}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      )}
      
      {results.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <ResultDisplay 
            results={results} 
            setResults={setResults} 
          />
        </div>
      )}
    </div>
  );
};

export default CustomGptForm;
