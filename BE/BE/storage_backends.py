from botocore.exceptions import ClientError
from storages.backends.s3 import S3Storage


class MinIOStorage(S3Storage):
    """
    S3-compatible storage tuned for MinIO.

    When AWS_S3_FILE_OVERWRITE is False, django-storages checks whether a key
    already exists via HeadObject before saving. Some MinIO bucket policies
    respond with 403 (instead of 404) for missing keys or denied HeadObject,
    which breaks admin uploads. Treat those responses as "does not exist".
    """

    def exists(self, name):
        try:
            return super().exists(name)
        except ClientError as exc:
            code = str(exc.response.get('Error', {}).get('Code', ''))
            status = exc.response.get('ResponseMetadata', {}).get('HTTPStatusCode')
            if code in ('403', '404', 'NoSuchKey', 'AccessDenied') or status in (403, 404):
                return False
            raise
