import { SubmitFeatureForm } from "@/components/submit-feature-form";
import { currency } from "@/lib/brand";

export default function SubmitPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-foreground">Submit a Feature</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        {`Describe the feature you'd like to see built. An admin will review and set a ${currency.singular} cost.`}
      </p>
      <SubmitFeatureForm />
    </div>
  );
}
