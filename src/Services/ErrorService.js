import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default class ErrorService {
    constructor() {
    }

    static onError(error) {
        const response = error.response;
        if (response && response.status >= 400 && response.status < 405) {
            ErrorService.sentryLogEngine(error);
            return false;
        }
    }

    static onInfo(error) {
// You can handle this differently
        this.sentryLogEngine(error);
    }

    static onDebug(error) {
        const response = error.response;
        if (response && response.status >= 400 && response.status < 405) {
            this.sentryLogEngine(error);
            return false;
        }
    }

    static initHandler() {
        const scope = this;
        window.onerror = (message, url, lineNo, columnNo, error) => {
            console.log(error, "test");
            if (error) {
                scope.onError(error);
                console.log(message, url, lineNo, columnNo, error);
            }
        };
    }

    static displayErrorAlert(message) {
        Swal.fire({
            title: "Error!",
            text: message,
            icon: "error",
        });
    }

    static sentryLogEngine(error) {
// Implement Sentry Engine here
        console.log(error, "Sentry");
    }
}
