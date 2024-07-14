import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

const ControllerWrapper = (section: string) => {
    const capitalized = section.charAt(0).toUpperCase() + section.slice(1);

    return (target: any) => {
        Controller(section)(target);
        ApiTags(capitalized)(target);
        ApiBearerAuth()(target);
    };
};

export { ControllerWrapper };
