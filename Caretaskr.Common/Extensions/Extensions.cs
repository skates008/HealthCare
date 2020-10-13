using System;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using Caretaskr.Common.ViewModel;
using Microsoft.AspNetCore.Http;

namespace Caretaskr.Common.Extensions
{
    public static class Extensions
    {
        public static int MAX_WIDTH = 400;
        public static int MAX_HEIGHT = 400;
        public static int DESTINATION_SIZE = 400;

        public static string ToDescription(this Enum value)
        {
            try
            {
                var fi = value.GetType().GetField(value.ToString());

                var attributes =
                    (DescriptionAttribute[]) fi.GetCustomAttributes(
                        typeof(DescriptionAttribute),
                        false);

                if (attributes.Length > 0)
                    return attributes[0].Description;
                return value.ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public static UploadResultViewModel SaveFile(IFormFile file, string folderPath)
        {
            if (file != null)
            {
                var path = Directory.GetCurrentDirectory() + "\\" + folderPath;

                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                var folderName = Path.Combine(folderPath);
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);


                var fullPath = Path.Combine(pathToSave, file.FileName);

                var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                var extension = Path.GetExtension(file.FileName);
                var fileNameThumbnail = fileName + "_th" + extension;
                var thumbnailPath = Path.Combine(pathToSave, fileNameThumbnail);
                SaveFileToDisk(file, fullPath);

                //set thumbnail image

                using (var destinationImage = new Bitmap(DESTINATION_SIZE, DESTINATION_SIZE))
                {
                    using (var sourceImage = new Bitmap(fullPath))
                    {
                        var aspectRatio = sourceImage.Width / (double) sourceImage.Height;
                        var newWidth = sourceImage.Width;
                        var newHeight = sourceImage.Height;
                        if (aspectRatio <= 1 && sourceImage.Width > MAX_WIDTH)
                        {
                            newWidth = MAX_WIDTH;
                            newHeight = (int) Math.Round(newWidth / aspectRatio);
                        }
                        else if (aspectRatio > 1 && sourceImage.Height > MAX_HEIGHT)
                        {
                            newHeight = MAX_HEIGHT;
                            newWidth = (int) Math.Round(newHeight * aspectRatio);
                        }

                        var newImage = new Bitmap(sourceImage, newWidth, newHeight);
                        var g = Graphics.FromImage(newImage);
                        g.InterpolationMode = InterpolationMode.HighQualityBilinear;
                        g.DrawImage(sourceImage, 0, 0, newImage.Width, newImage.Height);

                        newImage.Save(thumbnailPath);
                        newImage.Dispose();
                    }
                }

                return new UploadResultViewModel
                {
                    Name = fileName,
                    Extension = file.ContentType,
                    Path = fullPath,
                    ThumbnailPath = thumbnailPath,
                    ThumbnailImageName = fileNameThumbnail
                };
            }

            throw new ArgumentNullException("Error", innerException: null);
        }

        private static void SaveFileToDisk(IFormFile file, string fullPath)
        {
            using (var stream = new FileStream(fullPath, FileMode.Create))

            {
                file.CopyTo(stream);
                stream.Close();
            }
        }
    }
}