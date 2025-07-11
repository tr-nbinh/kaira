import { ToastPosition } from "../app/models/toast.interface";

export function getPositionClasses(position: ToastPosition): string[] {
    switch (position) {
        case 'top-left':
            return ['top-0', 'start-0'];
        case 'top-center':
            return ['top-0', 'start-50', 'translate-middle-x'];
        case 'bottom-left':
            return ['bottom-0', 'start-0'];
        case 'bottom-right':
            return ['bottom-0', 'end-0'];
        case 'bottom-center':
            return ['bottom-0', 'start-50', 'translate-middle-x'];
        default:
            return ['top-0', 'end-0']; // top-right (default)
    }
}
