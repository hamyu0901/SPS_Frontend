import { loginCheckAPI } from "@/api/authAPI";

const loginCheck = () => {
    try {
        return loginCheckAPI().then(res => res.data.message === 'ok');
    } catch(error) {
        console.error(error);
    }
}

export { loginCheck };