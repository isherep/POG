import logging
import azure.functions as func

# main method takes an Http request as parameter.
def main(req: func.HttpRequest) -> func.HttpResponse:
    headers = {"my-http-header": "some-value"}
    logging.info('Python HTTP trigger function processed a request.')
    logging.info(req.__dict__)

    #method = req.method
    machineId = req.params.get('machineId')

    # This stament checks for a PUT request.
    if (req.method == "PUT"):
        try:
            req_body = req.get_json()
            logging.info(req_body)
            return func.HttpResponse(f"successful request")
        except ValueError:
            pass
        else:
            machineId = req_body.get('machineId')
    # it returns an error Http code that is not a PUT request.
    else:
        logging.info("Not a PUT request...")
        # returns a Http 400 status bad request.
        return func.HttpResponse(
            'Request was not a PUT',
            status_code=400
            )
    # returns the machine id 
    if machineId:
        return func.HttpResponse(f"Your machineId is: {machineId}!", headers=headers)
    else:
        # retuerns a Http 400 status bad request. 
        return func.HttpResponse(
            "Please pass a PUT request on the query string or in the request body",
            status_code=400
        )