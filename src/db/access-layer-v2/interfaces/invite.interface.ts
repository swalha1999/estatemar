import { invites, users, files, Invite, User, File } from "@/db/schema-auth";
import { BaseSearchParams } from "./base.interface";

/**
 * Interface for the invites table
 * @description This interface is used to define the structure of the invites table
 * @returns {Object} The interface for the invites table with the following fields:
 */
export const inviteInterfaceSelect = {
    id: invites.id,
    groomName: invites.groomName,
    brideName: invites.brideName,
    date: invites.date,
    location: invites.location,
    inviter: invites.inviter,
    whatsappTemplate: invites.whatsappTemplate,
    weddingCardFileId: invites.weddingCardFileId,
    userId: invites.userId,
    AdminApproved: invites.AdminApproved,
    isCanceled: invites.isCanceled,
    scheduledSendAt: invites.scheduledSendAt,
    // User fields from join
    email: users.email,
    username: users.username,
    // File fields from join
    fileName: files.fileName,
}

export type InviteInterface = {
    id: Invite['id'];
    groomName: Invite['groomName'];
    brideName: Invite['brideName'];
    date: Invite['date'];
    location: Invite['location'];
    inviter: Invite['inviter'];
    whatsappTemplate: Invite['whatsappTemplate'];
    weddingCardFileId: Invite['weddingCardFileId'];
    userId: Invite['userId'];
    AdminApproved: Invite['AdminApproved'];
    isCanceled: Invite['isCanceled'];
    scheduledSendAt: Invite['scheduledSendAt'];
    email: User['email'];
    username: User['username'];
    fileName: File['fileName'];
} 

export interface InviteSearchParams extends BaseSearchParams {
    groomName?: Invite['groomName'];
    brideName?: Invite['brideName'];
    date?: Invite['date'];
    location?: Invite['location'];
    inviter?: Invite['inviter'];
    whatsappTemplate?: Invite['whatsappTemplate'];
    weddingCardFileId?: Invite['weddingCardFileId'];
    userId?: Invite['userId'];
    AdminApproved?: Invite['AdminApproved'];
    isCanceled?: Invite['isCanceled'];
    scheduledSendAt?: Invite['scheduledSendAt'];
    email?: User['email'];
    username?: User['username'];
    fileName?: File['fileName'];
}