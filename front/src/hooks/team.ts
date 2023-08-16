import {useEffect, useState} from "react";
import {AddTeam, DeleteTeam, GetTeams, UpdateTeam} from "../services/team";
import {Team} from "../models/team";

export const useTeam = () => {
  const [ teams, setTeams ] = useState<Array<Team>>([]);

  useEffect(() => {
    let isMounted = true;
    GetTeams()
      .then((teams) => {
        if (isMounted) {
          setTeams(teams);
        }
      });

    return () => {
      isMounted = false
    }
  }, []);

  const addTeam = async (team: Team) => {
    const response = await AddTeam(team);
    if (response.newTeam) {
      setTeams(teams.concat({ ...response.newTeam, createdAt: new Date(response.newTeam.createdAt), updatedAt: new Date(response.newTeam.updatedAt) }))
    }
    return response;
  }

  const updateTeam = async (id: number, team: Team) => {
    const res = await UpdateTeam(id, team);
    if (res.message) {
      setTeams(teams.map(t => {
        if (t.id === id) {
          return { ...t, ...team };
        }
        return t;
      }));
    }
    return res;
  }

  const deleteTeam = async (id: number) => {
    const res = await DeleteTeam(id);
    if (res.message) {
      setTeams(teams.filter(team => team.id !== id));
    }
    return res;
  }

  return { teams, addTeam, updateTeam, deleteTeam };
}