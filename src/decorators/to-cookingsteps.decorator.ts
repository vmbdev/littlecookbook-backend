import { Transform } from 'class-transformer';
import { CookingStep } from 'src/recipe/cookingstep.model';

export function ToCookingSteps(): (target: any, key: string) => void {
  return Transform(({ value }: any) => {
    try {
      const steps = JSON.parse(value);

      if (Array.isArray(steps)) {
        const test = steps.every((step: CookingStep) => {
          return (
            step.hasOwnProperty('time') &&
            step.hasOwnProperty('instruction') &&
            step.hasOwnProperty('ingredients')
          );
        });

        if (test) return steps;
      }

      return null;
    } catch (err) {
      return null;
    }
  });
}
