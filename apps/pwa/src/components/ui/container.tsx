import { cn } from "@/lib/utils";

interface ContainerProps {
    className?: string,
    children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
    className, children
}) => {
    return (
        <div className={cn("mx-auto w-full", className)}>
            {children}
        </div>
    );
};

export default Container;