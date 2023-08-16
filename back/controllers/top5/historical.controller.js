const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const moment = require('moment');

exports.updateHistorical = async (body, next) => {
    console.log("updateHisto", body)
    let id = body.id;
    let month = body.month;
    let year = body.year;
    let data = body.data;
    let target = body.target;

    if (id !== undefined && month !== undefined && year !== undefined) {
        month = month.trim()
        year = year.trim()

        const selectHisto = await prisma.top5_historical.findUnique({
            where: { id: id }
        })
        console.log("selectOneHisto")
        console.log(selectHisto)
        if (selectHisto) {
            return await prisma.top5_historical.update({
                where: { id: id },
                data: {
                    month: month,
                    year: year,
                    data: data,
                    target: target
                }
            })
        } else {
            next(new Error(conf.errors.wrongId))
        }
    }
};

exports.commentHistorical = async (req, res, next) => {
    console.log("comment Histo")
    console.log(req.body);
    let id = req.body.id;
    let month = req.body.month.toString().trim().padStart(2, "0")
    let year = req.body.year.trim()
    let comment = req.body.comment
    let data = req.body.data.trim()
    let target = req.body.target.trim()
    let indicatorId = req.body.indicatorId

    if (id !== undefined && month !== undefined && year !== undefined) {
        const selectHisto = await prisma.top5_historical.findUnique({
            where: { id: id }
        })
        console.log("selectOneHisto")
        console.log(selectHisto)
        if (selectHisto && (data !== "" || target !== "")) {
            await prisma.top5_historical.update({
                where: { id: id },
                data: {
                    comment: comment,
                    data: data,
                    target: target
                }
            })
                .then(() => {
                    res.status(201).json({
                        message: 'Post updated successfully!'
                    })
                })
                .catch((error) => {
                    res.status(400).json({
                        error: "UpdateHistorical : " + error
                    })
                })
        } else if ((data !== '' || target !== '') && !selectHisto) {
            await prisma.top5_historical.create({
                data: {
                    month: month,
                    year: year,
                    data: data,
                    target: target,
                    comment: comment,
                    indicator_id: indicatorId,
                }
            })
                .then(() => {
                    res.status(201).json({
                        message: 'Post updated successfully!'
                    })
                })
                .catch((error) => {
                    res.status(400).json({
                        error: "UpdateHistorical : " + error
                    })
                })
        } else {
            console.log("empty data ", req.body)
            res.status(200).json({
                error: "Le commentaire ne peut etre enregistré si les données du mois sont vides"
            })
        }
    }
}

exports.deleteHistorical = async (req, res, next) => {
    console.log("deleteOneHistorical")
    console.log(req.params.id)
    const researchHistorical = await prisma.top5_historical.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    console.log(researchHistorical)
    if (researchHistorical) {
        const deleteHistorical = await prisma.top5_historical.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
            .then(
                () => {
                    res.status(201).json({
                        message: 'Post deleted successfully!'
                    });
                }).catch(
                    (error) => {
                        res.status(400).json({
                            error: "DeleteHistorical : " + error
                        });
                    }
                );
    } else {
        next(new Error("wrongId"))
    };
};

exports.deleteHistoricalByIndicator = async (req, res, next) => {
    console.log("deleteHistoricalByIndicator")

    const researchHistorical = await prisma.top5_historical.findMany({
        where: {
            indicator_id: parseInt(req.params.id)
        }
    })
    console.log(researchHistorical)
    if (researchHistorical) {
        const deleteHistoricalByIndicator = await prisma.top5_historical.deleteMany({
            where: {
                indicator_id: parseInt(req.params.id)
            }
        })
            .then(
                () => {
                    res.status(201).json({
                        message: 'Historicals deleted successfully!'
                    });
                }).catch(
                    (error) => {
                        res.status(400).json({
                            error: "DeleteHistoricals : " + error
                        });
                    }
                );
    } else {
        next(new Error("wrongId"))
    };
};

exports.createHistorical = async (body, next) => {
    console.log("createHistorical");
    console.log(body)
    let month = body.month;
    let year = body.year;
    let data = body.data;
    let target = body.target;
    let indicatorId = body.indicatorId;

    // Vérifie que l'historique pour ce mois / année n'existe pas déjà
    let existHistorical = await this.getHistoricalsByIndicator(indicatorId, year);
    existHistorical = existHistorical.find((data) => data.month == month);

    if (!existHistorical && month !== undefined && year !== undefined && indicatorId !== undefined) {
        month = month.trim()

        return await prisma.top5_historical.create({
            data: {
                month: month,
                year: year.toString(),
                data: data,
                target: target,
                indicator_id: indicatorId,
            },
        })
    } else {
        next(new Error("create historical failed"))
    }

};

exports.getOneHistorical = async (id) => {
    return await prisma.top5_historical.findUnique({
        where: {
            id: id
        }
    });
};

exports.getHistoricalsByIndicator = async (indicatorId, year) => {
    if (year !== undefined) {
        return await prisma.top5_historical.findMany({
            where: {
                indicator_id: indicatorId,
                year: year
            }
        });
    } else {
        return await prisma.top5_historical.findMany({
            where: {
                indicator_id: indicatorId
            }
        });
    }
};

exports.getAllHistorical = (req, res, next) => {
    const historical = prisma.top5_historical.findMany().then(
        (historical) => {
            res.status(201).json(historical);
        }).catch(
            (error) => {
                res.status(400).json({
                    error: "GetAllHistorical : " + error
                });
            }
        );
};


exports.getAllIndicatorsCalculHistorical = async () => {
    return await prisma.top5_calculhistorical.findMany({});
}

parseDate = (date) => {
    const parts = date.split("/");
    return new Date(parseInt(parts[2], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10));
}

exports.computeLastHistorical = async (indicatorId, date) => {
    const curves = await prisma.top5_curve.findMany({
        where: {
            indicator_id: indicatorId
        },
        include: {
            data: true
        },
    });

    if (curves[0].curveType == 1) { // cas d'un histogramme empilé ou on prend en compte toutes les courbes
        let historical_data = 0;
        for (const curve of curves) {
            for (const value of curve.data) {
                var dataDate = parseDate(value.date);
                if (date.getTime() == dataDate.getTime() && value.data != "") // sélection que du dernier jour du mois
                    historical_data += parseInt(value.data, 10);
            }
        }
        return historical_data;
    } else {
        const curve = curves[0];
        let historical_data = 0;
        for (const value of curve.data) {
            var dataDate = parseDate(value.date);
            if (date.getTime() == dataDate.getTime() && value.data != "") // sélection que du dernier jour du mois
                historical_data += parseInt(value.data, 10);
        }

        return historical_data
    }
}

exports.computeSumHistorical = async (indicatorId, date) => {
    const curves = await prisma.top5_curve.findMany({
        where: {
            indicator_id: indicatorId
        },
        include: {
            data: true
        },
    });
    console.log('curves ', curves)

    if (curves[0].curveType == 1) { // cas d'un histogramme empilé ou on prend en compte toutes les courbes
        let historical_data = 0;
        for (const curve of curves) {
            for (const value of curve.data) {
                var dataDate = parseDate(value.date);
                if (date.getMonth() == dataDate.getMonth() && date.getFullYear() == dataDate.getFullYear() && value.data != "") // sélection de toutes les données du mois
                    historical_data += parseInt(value.data, 10);
            }
        }
        return historical_data;
    } else {
        const curve = curves[0];
        let historical_data = 0;
        for (const value of curve.data) {
            var dataDate = parseDate(value.date);
            if (date.getMonth() == dataDate.getMonth() && date.getFullYear() == dataDate.getFullYear() && value.data != "") // sélection de toutes les données du mois
                historical_data += parseInt(value.data, 10);
        }

        console.log('historical_data ', historical_data)

        return historical_data
    }
}

exports.computeAverageHistorical = async (indicatorId, date) => {
    const curves = await prisma.top5_curve.findMany({
        where: {
            indicator_id: indicatorId
        },
        include: {
            data: true
        },
    });

    let historical_data = 0;
    if (curves[0].curveType == 1) { // cas d'un histogramme empilé ou on prend en compte toutes les courbes
        for (const curve of curves) {
            for (const value of curve.data) {
                var dataDate = parseDate(value.date);
                if (date.getMonth() == dataDate.getMonth() && date.getFullYear() == dataDate.getFullYear() && value.data != "") // sélection de toutes les données du mois
                    historical_data += parseInt(value.data, 10);
            }
        }
    } else {
        const curve = curves[0];
        for (const value of curve.data) {
            var dataDate = parseDate(value.date);
            if (date.getMonth() == dataDate.getMonth() && date.getFullYear() == dataDate.getFullYear() && value.data != "") // sélection de toutes les données du mois
                historical_data += parseInt(value.data, 10);
        }
    }

    const numberOfDaysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    return Math.round(historical_data / numberOfDaysInMonth * 100) / 100;
}