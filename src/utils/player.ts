import { useEffect, useState } from "react";
import apiRequest, { ResponseDataType } from "./apiRequest";
import { Role } from "../../types/discord";

export function useGuildRoles(playerId: string) {
	const [data, setData] = useState<Role[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			const { status, data } = await apiRequest(
				`${process.env.NEXT_PUBLIC_API_URL!}/api/v1/guild/${playerId}/roles`,
				{ method: 'GET', cache: 'no-cache' },
				ResponseDataType.JSON,
				true
			);
			if (status == 200) {
				const roles = data.roles as Role[];
				setData(roles);
			}
			setLoading(false);
		})();
	}, [playerId]);
	return { data, loading };
}
