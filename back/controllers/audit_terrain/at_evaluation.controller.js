const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllEvaluation = async (req, res, next) => {
    console.log('getAllEvaluation');

    const evaluation = await prisma.at_evaluation
        .findMany({
            orderBy: [{ createdAt: 'desc' }]
        })
        .then(result => {
            res.status(201).json(result);
        })
        .catch(error => {
            res.status(400).json({
                error: `getAllEvaluation : ${error}`
            });
        });
};

exports.getOneEvaluation = async (req, res, next) => {
    console.log('getOneEvaluation');

    const { id } = req.params;

    const evaluation = await prisma.at_evaluation
        .findUnique({
            where: {
                id: parseInt(id, 10)
            }
        })
        .then(evaluation => {
            res.status(201).json(evaluation);
        })
        .catch(error => {
            res.status(200).json({
                error: `getOneEvaluation : ${error}`
            });
        });
};

exports.createManyEvaluations = async (req, res, next) => {
    console.log('createManyEvaluations');

    const {
        evaluations,
        user
    } = req.body;

    if( evaluations && evaluations.length > 0 ) {
        let newEvaluations = [];

        for (const e of evaluations) {
            const {
                check,
                comment,
                image1,
                checkpoint_id,
                audit_id
            } = e;
            if( check != null && checkpoint_id && audit_id ) {
                const newEvaluation = await prisma.at_evaluation
                    .create({
                        data: {
                            check: check,
                            comment: comment,
                            image1: image1,
                            checkpoint_id: checkpoint_id,
                            audit_id: audit_id,
                            createdBy: user?.id?.toString(),
                            updatedBy: user?.id?.toString()
                        }
                    });
                const evaluation = await prisma.at_evaluation
                    .findUnique({
                        where: {
                            id: parseInt(newEvaluation.id)
                        }
                    })
                newEvaluations.push(evaluation);
            }
        }

        res.status(201).json(newEvaluations);
    } else if( !evaluations || evaluations.length === 0 ) {
        console.log(`createManyEvaluations : No Evaluations Provided`);
        res.status(200).json({
            error: `No Evaluations Provided`
        });
    }
}

exports.updateManyEvaluations = async (req, res, next) => {
    console.log('updateAllEvaluations');

    const { ids } = req.params;
    const {
        evaluations,
        user
    } = req.body;

    if( evaluations && evaluations.length > 0 ) {
        let newEvaluations = [];

        for( const e of evaluations ) {
            const {
                id,
                check,
                comment,
                image1,
                checkpoint_id,
                audit_id
            } = e;
            const researchEvaluation = await prisma.at_evaluation.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            if( researchEvaluation && check != null && checkpoint_id && audit_id ) {
                const updateEvaluation = await prisma.at_evaluation
                    .update({
                        where: {
                            id: parseInt(id)
                        },
                        data: {
                            check: check,
                            comment: comment,
                            image1: image1,
                            checkpoint_id: checkpoint_id,
                            audit_id: audit_id,
                            createdBy: user?.id?.toString(),
                            updatedBy: user?.id?.toString(),
                            updatedAt: new Date()
                        }
                    })
                    .then(async () => {
                        const newEvaluation = await prisma.at_evaluation.findUnique({
                            where: {
                                id: parseInt(id)
                            }
                        });
                        newEvaluations.push(newEvaluation);
                    })
            }
        }

        if( newEvaluations.length > 0 ) {
            res.status(201).json({
                message: 'Evaluations updated successfully!'
            });
        } else {
            res.status(201).json({
                error: 'No evaluations updated'
            });
        }
    }
}
exports.deleteManyEvaluations = async (req, res, next) => {
    console.log('deleteEvaluation');

    const { ids } = req.params;

    if( ids && ids.length > 0 ) {
        let deletesEvaluations = [];

        for( const id of ids ) {
            if ( !isNaN(id) ) {
                const researchEvaluation = await prisma.at_evaluation.findUnique({
                    where: {
                        id: parseInt(id)
                    }
                });
                const deleteEvaluation = await prisma.at_evaluation.delete({
                    where: {
                        id: parseInt(id)
                    }
                });
                deletesEvaluations.push(researchEvaluation);
            }
        }

        if( deletesEvaluations.length > 0 ) {
            res.status(201).json({
                message: 'Evaluations deleted successfully!',
            });
        } else {
            res.status(400).json({
                error: 'No evaluations deleted'
            });
        }
    }
}
