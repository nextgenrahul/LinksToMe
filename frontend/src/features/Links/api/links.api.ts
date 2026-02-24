import apiClient from "@/shared/api/apiClient";
import type { UserLink, CreateLinkPayload } from "../types";

export async function getMyLinksApi(): Promise<UserLink[]> {
    const res = await apiClient.get<{ data: UserLink[] }>("/links/me");
    return res.data.data;
}

export async function createLinkApi(payload: CreateLinkPayload): Promise<UserLink> {
    const res = await apiClient.post<{ data: UserLink }>("/links", payload);
    return res.data.data;
}

export async function deleteLinkApi(linkId: string): Promise<void> {
    await apiClient.delete(`/links/${linkId}`);
}
