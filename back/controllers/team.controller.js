const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Récupérer tous les equipes
exports.getAllTeams = async (req, res, next) => {
  const team = await prisma.team
    .findMany({})
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getAllTeams : " + error,
      });
    });
};

// Récupérer une seule equipe (id)
exports.getOneTeam = async (req, res, next) => {
  const team = await prisma.team
    .findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
    })
    .then((team) => {
      res.status(201).json(team);
    })
    .catch((error) => {
      res.status(200).json({
        error: "GetOneTeam : " + error,
      });
    });
};

// Récupérer une seule equipe (name)
exports.getOneTeamByName = async (req, res, next) => {
  const team = await prisma.team
    .findUnique({
      where: {
        name: req.params.name,
      },
    })
    .then((team) => {
      res.status(201).json(team);
    })
    .catch((error) => {
      res.status(201).json({
        error: "getOneTeamByName : " + error,
      });
    });
};

// Créer une equipe
exports.createTeam = async (req, res, next) => {
  console.log("createTeam");

  let teamName = req.body.name;
  let teamDescription = req.body.description;
  teamName = teamName.trim();
  teamDescription = teamDescription.trim();

  const newTeam = await prisma.team.create({
    data: {
      name: teamName,
      description: teamDescription,
    },
  });

  console.log("team added");
  console.log(newTeam);
  res.status(201).json({ newTeam: newTeam });
};

// Modifier une equipe (id)
exports.updateTeam = async (req, res, next) => {
  console.log("updateTeam");

  let teamName = req.body.name;
  let teamDescription = req.body.description;

  console.log(req.body);

  const researchTeam = await prisma.team.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchTeam) {
    const updateTeam = await prisma.team
      .update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: teamName,
          description: teamDescription,
          updatedAt: new Date(),
        },
      })
      .then(() => {
        res.status(201).json({
          message: "Team updated successfully!",
        });
      })
      .catch((error) => {
        res.status(201).json({
          error: "Update team : " + error,
        });
      });

    console.log(updateTeam);
  }
};

// Supprimer une equipe
exports.deleteTeam = async (req, res, next) => {
  console.log("deleteTeam");

  const researchTeam = await prisma.team.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (researchTeam) {
    const deleteTeam = await prisma.team.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(201).json({
      message: "Team deleted successfully!",
    });
  } else {
    res.status(201).json({
      error: "Bad Team id",
    });
  }
};
