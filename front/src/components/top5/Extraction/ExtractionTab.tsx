import MUIDataTable from "mui-datatables";

interface ExtractionTabProps {
    title: string,
    data: Array<any>,
    columns: Array<string>,
    options: any
}

const ExtractionTab = ({
    title,
    data,
    columns,
    options
} : ExtractionTabProps) => {
    return (
        <>
            <MUIDataTable
                title={title}
                data={data}
                columns={columns}
                options={options}
            />
        </>
    )
}

export default ExtractionTab;
