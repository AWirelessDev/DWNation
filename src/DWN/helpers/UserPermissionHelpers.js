import { useContext } from "react";
import { RoleContext } from '../provider';

export const peopleAdmin = 'People Admin';
export const peopleHR = 'People HR';
export const peopleHRProcss = 'People HR Processors';

export const hasPermission = (value) => {
    const loginUserDetails = useContext(RoleContext);
    const permissions = loginUserDetails?.data.permissions;
    if(permissions?.length) {
       return permissions.find((permission) => permission.component == value) || false;
    }
    return false;
}

export const isLoginUserAdmin = () => {
    const loginUserDetails = useContext(RoleContext);
    const loginUserRoles = loginUserDetails?.data?.roles?.length ? loginUserDetails.data?.roles : [];
    return loginUserRoles.includes(peopleAdmin);
};

export const isThisUserHR = () => {
    const loginUserDetails = useContext(RoleContext);
    const loginUserRoles = loginUserDetails?.data?.roles?.length ? loginUserDetails.data?.roles : [];
    return loginUserRoles.includes(peopleHR);
};

export const isThisUserHRProcss = () => {
    const loginUserDetails = useContext(RoleContext);
    const loginUserRoles = loginUserDetails?.data?.roles?.length ? loginUserDetails.data?.roles : [];
    return loginUserRoles.includes(peopleHRProcss);
};











