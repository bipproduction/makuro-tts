import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const _is_login = atom<boolean>(true)
const _token = atomWithStorage("token", "")
const _nav = atom<string>("home")

export { _is_login, _token, _nav }