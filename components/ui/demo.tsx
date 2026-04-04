import ShaderBackground from "@/components/ui/shader-background";
import { NotFoundPage } from "@/components/ui/404-page-not-found";

const DemoOne = () => {
  return <ShaderBackground />;
};

function PageNotFoundDemo() {
  return (
    <div className="w-full">
      <NotFoundPage />
    </div>
  );
}

export { DemoOne, PageNotFoundDemo };
